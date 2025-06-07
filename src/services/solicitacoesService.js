export async function enviarSolicitacao(solicitacao) {
    try {
        const response = await fetch('http://10.0.2.2:8080/solicitacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipoRecurso: solicitacao.tipoRecurso,
                quantidade: Number(solicitacao.quantidade),
                abrigoId: Number(solicitacao.abrigoId),
                alertaId: Number(solicitacao.alertaId),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao enviar solicitação: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro no service:', error.message);
        throw error;
    }
}
