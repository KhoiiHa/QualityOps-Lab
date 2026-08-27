import { expect, test } from '@playwright/test';

const ollamaBaseUrl = 'http://127.0.0.1:11434';
const model = 'qwen3:1.7b';

const categories = ['FUNCTIONAL', 'SECURITY', 'USABILITY', 'PERFORMANCE', 'DATA'];
const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const bugReports = [
  {
    name: 'unberechtigter Rechnungszugriff',
    statements: [
      { id: 'S1', text: 'Die Prüfung erfolgt mit einem angemeldeten Standardkonto.' },
      {
        id: 'S2',
        text: 'Das Standardkonto kann über eine direkte URL die Rechnung eines anderen Kontos herunterladen.',
      },
    ],
    expected: {
      category: 'SECURITY',
      severity: 'HIGH',
      evidenceId: 'S2',
    },
  },
  {
    name: 'doppelte Bestellung',
    statements: [
      { id: 'S1', text: 'Die Netzwerkverbindung ist während der Prüfung stabil.' },
      {
        id: 'S2',
        text: 'Ein einzelner Klick auf Bestellung abschicken legt zwei identische Bestellungen an.',
      },
    ],
    expected: {
      category: 'FUNCTIONAL',
      severity: 'HIGH',
      evidenceId: 'S2',
    },
  },
  {
    name: 'abgeschnittene Button-Beschriftung',
    statements: [
      {
        id: 'S1',
        text: 'Der Abbrechen-Button lässt sich weiterhin antippen und führt korrekt zurück.',
      },
      {
        id: 'S2',
        text: 'Auf einem 320 Pixel breiten Display ist die Beschriftung des Abbrechen-Buttons abgeschnitten.',
      },
    ],
    expected: {
      category: 'USABILITY',
      severity: 'LOW',
      evidenceId: 'S2',
    },
  },
];

test.beforeAll(async ({ request }) => {
  let response;

  try {
    response = await request.get(`${ollamaBaseUrl}/api/tags`, { timeout: 3_000 });
  } catch {
    throw new Error(
      'Ollama ist nicht erreichbar. Starte Ollama lokal und führe danach npm run test:ai erneut aus.',
    );
  }

  if (!response.ok()) {
    throw new Error(`Ollama antwortet unerwartet mit HTTP-Status ${response.status()}.`);
  }

  const installedModels = (await response.json()) as {
    models?: Array<{ name?: string }>;
  };

  if (!installedModels.models?.some((installedModel) => installedModel.name === model)) {
    throw new Error(`Das lokale Modell ${model} ist nicht installiert.`);
  }
});

test.describe('lokale KI-Analyse synthetischer Bug-Reports', () => {
  test('erfüllt den technischen Vertrag und die definierte Qualitätsschwelle', async ({
    request,
  }, testInfo) => {
    const evaluations = [];

    for (const bugReport of bugReports) {
      const evidenceIds = bugReport.statements.map((statement) => statement.id);
      const responseSchema = {
        type: 'object',
        properties: {
          category: { type: 'string', enum: categories },
          severity: { type: 'string', enum: severities },
          summary: { type: 'string' },
          evidenceId: { type: 'string', enum: evidenceIds },
        },
        required: ['category', 'severity', 'summary', 'evidenceId'],
        additionalProperties: false,
      };

      const response = await request.post(`${ollamaBaseUrl}/api/chat`, {
        data: {
          model,
          stream: false,
          think: false,
          format: responseSchema,
          options: {
            temperature: 0,
            seed: 42,
            num_predict: 140,
          },
          messages: [
            {
              role: 'system',
              content: [
                'Bewerte einen synthetischen Software-Bug-Report.',
                'FUNCTIONAL betrifft fehlerhaftes Verhalten, SECURITY den Schutz von Daten oder Zugriffen, USABILITY die Bedienbarkeit, PERFORMANCE die Geschwindigkeit und DATA die Datenqualität.',
                'LOW hat geringe Auswirkungen, MEDIUM merkliche, HIGH schwere und CRITICAL existenzielle oder flächendeckende Auswirkungen.',
                'Verwende SECURITY und HIGH für unberechtigten Zugriff auf Daten eines anderen Kontos.',
                'Verwende FUNCTIONAL und HIGH, wenn eine einzelne Aktion eine Bestellung oder finanzielle Transaktion doppelt ausführt.',
                'Verwende USABILITY und LOW für einen rein visuellen Textfehler, wenn die betroffene Aktion weiterhin funktioniert.',
                'evidenceId muss auf die Aussage mit dem tatsächlich beobachteten Fehler zeigen, nicht auf Testumgebung, Vorbedingung oder erwartetes Verhalten.',
                'Antworte ausschließlich nach dem vorgegebenen JSON-Schema und erfinde keine Angaben.',
              ].join(' '),
            },
            {
              role: 'user',
              content: bugReport.statements
                .map((statement) => `${statement.id}: ${statement.text}`)
                .join('\n'),
            },
          ],
        },
      });

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const responseBody = (await response.json()) as {
        message?: { content?: string };
      };

      expect(responseBody.message?.content).toBeTruthy();

      const analysis = JSON.parse(responseBody.message?.content ?? '{}') as {
        category?: string;
        severity?: string;
        summary?: string;
        evidenceId?: string;
      };

      expect(Object.keys(analysis).sort()).toEqual([
        'category',
        'evidenceId',
        'severity',
        'summary',
      ]);
      expect(categories).toContain(analysis.category);
      expect(severities).toContain(analysis.severity);
      expect(analysis.summary).toEqual(expect.any(String));
      expect(analysis.summary?.trim()).not.toHaveLength(0);
      expect(evidenceIds).toContain(analysis.evidenceId);

      const matchesExpectedAssessment =
        analysis.category === bugReport.expected.category &&
        analysis.severity === bugReport.expected.severity &&
        analysis.evidenceId === bugReport.expected.evidenceId;

      evaluations.push({
        bugReport: bugReport.name,
        expected: bugReport.expected,
        actual: {
          category: analysis.category,
          severity: analysis.severity,
          evidenceId: analysis.evidenceId,
        },
        matchesExpectedAssessment,
      });
    }

    await testInfo.attach('ai-evaluation.json', {
      body: Buffer.from(JSON.stringify(evaluations, null, 2)),
      contentType: 'application/json',
    });

    const successfulAssessments = evaluations.filter(
      (evaluation) => evaluation.matchesExpectedAssessment,
    );

    expect(
      successfulAssessments.length,
      `Mindestens zwei von drei Referenzbewertungen müssen übereinstimmen. Ergebnis: ${JSON.stringify(evaluations)}`,
    ).toBeGreaterThanOrEqual(2);
  });
});
