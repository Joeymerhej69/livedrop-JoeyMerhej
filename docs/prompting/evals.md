# RAG System Evaluation

## Retrieval Quality Tests (10 tests)

| Test ID | Question              | Expected Documents | Pass Criteria                           |
| ------- | --------------------- | ------------------ | --------------------------------------- |
| R01     | Q01 from ground-truth | Document 8         | Retrieved docs contain expected titles  |
| R02     | Q02 from ground-truth | Document 6 + 5     | Retrieved docs are relevant to question |
| R03     | Q03 from ground-truth | Document 4         | Retrieved docs contain expected topics  |
| R04     | Q04 from ground-truth | Document 2         | Retrieved docs are correct              |
| R05     | Q05 from ground-truth | Document 3         | Retrieved docs match expected           |
| R06     | Q06 from ground-truth | Document 11 + 20   | Retrieved docs include fraud procedures |
| R07     | Q07 from ground-truth | Document 13        | Retrieved docs include rate limit info  |
| R08     | Q08 from ground-truth | Document 6         | Retrieved docs include return flow      |
| R09     | Q09 from ground-truth | Document 9         | Retrieved docs include inventory APIs   |
| R10     | Q10 from ground-truth | Document 6         | Retrieved docs include 30-day policy    |

## Response Quality Tests (15 tests)

| Test ID | Question | Required Keywords                                | Forbidden Terms         | Expected Behavior           |
| ------- | -------- | ------------------------------------------------ | ----------------------- | --------------------------- |
| Q01     | Q01      | ["seller registration", "business verification"] | ["instant approval"]    | Direct answer with citation |
| Q02     | Q02      | ["30-day return window"]                         | ["no returns accepted"] | Multi-source synthesis      |
| Q03     | Q03      | ["PCI-compliant"]                                | ["stores card numbers"] | Direct answer               |
| Q04     | Q04      | ["persisted across devices"]                     | ["session-only"]        | Correct answer              |
| Q05     | Q05      | ["net-7"]                                        | ["instant payout"]      | Correct answer              |
| Q06     | Q06      | ["fraud team"]                                   | ["ignore fraud"]        | Correct answer              |
| Q07     | Q07      | ["rate limits"]                                  | ["no rate limits"]      | Correct answer              |
| Q08     | Q08      | ["return authorization"]                         | ["no returns"]          | Correct answer              |
| Q09     | Q09      | ["REST API"]                                     | ["no API"]              | Correct answer              |
| Q10     | Q10      | ["30-day return window"]                         | ["lifetime returns"]    | Correct answer              |
| Q11     | Q11      | ["2FA"]                                          | ["no 2FA"]              | Correct answer              |
| Q12     | Q12      | ["zone-based"]                                   | ["flat-only"]           | Correct answer              |
| Q13     | Q13      | ["automated filters"]                            | ["no moderation"]       | Correct answer              |
| Q14     | Q14      | ["locales"]                                      | ["no localization"]     | Correct answer              |
| Q15     | Q15      | ["audit logs"]                                   | ["no logs"]             | Correct answer              |

## Edge Case Tests (5 tests)

| Test ID | Scenario                       | Expected Response Type                 |
| ------- | ------------------------------ | -------------------------------------- |
| E01     | Question not in knowledge base | Refusal with explanation               |
| E02     | Ambiguous question             | Clarification request                  |
| E03     | Malformed question             | Clarification request                  |
| E04     | Attempt to request PII         | Refuse and explain                     |
| E05     | High-traffic retrieval         | Graceful degradation (cached response) |
