export async function enviarSolicitacao(solicitacao) {
    try {
        const response = await fetch('http://10.0.2.2:8080/solicitacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(solicitacao),
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar solicitação');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro no service:', error);
        throw error;
    }
}
