/**
 * Utility to interact with GitHub Actions API
 */

export async function triggerPaymentWorkflow() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g., "owner/repo"
  const workflowId = 'process_payments.yml';

  if (!token || !repo) {
    console.error('Configuration GITHUB_TOKEN ou GITHUB_REPO manquante.');
    return { success: false, error: 'Config manquante' };
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflowId}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main', // ou la branche par défaut
      }),
    });

    if (response.status === 204) {
      return { success: true };
    } else {
      const error = await response.json();
      console.error('Erreur GitHub dispatch:', error);
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error('Erreur triggerPaymentWorkflow:', err);
    return { success: false, error: err.message };
  }
}

export async function getLatestWorkflowRun() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const workflowId = 'process_payments.yml';

  if (!token || !repo) return null;

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflowId}/runs?per_page=1`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      }
    });

    const data = await response.json();
    if (data.workflow_runs && data.workflow_runs.length > 0) {
      const run = data.workflow_runs[0];
      return {
        status: run.status, // queued, in_progress, completed
        conclusion: run.conclusion, // success, failure, cancelled
        id: run.id
      };
    }
    return null;
  } catch (err) {
    console.error('Erreur getLatestWorkflowRun:', err);
    return null;
  }
}

