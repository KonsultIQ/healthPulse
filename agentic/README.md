````markdown
# How to Run Agentic HealthPulse

## Prerequisites

- Docker
- Docker Compose
- OpenAI API Key

## Steps

```bash

   cd agentic
````

2. **Set your OpenAI API key**:

   ```bash
   export OPENAI_API_KEY=your_openai_key
   ```

3. **Run all services**:

   ```bash
   docker-compose up --build
   ```

4. **Access services** (ensure no port conflicts):
   * Hospital API: `http://localhost:5002`
   * Social Media API: `http://localhost:5001`
   * Completion API: `http://localhost:8000`

```
