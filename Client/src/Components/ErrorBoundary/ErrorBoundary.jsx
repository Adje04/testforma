import React from 'react';

// Sans ça, une erreur JS pendant le rendu démonte tout l'arbre React
// et laisse une page totalement blanche, sans aucun message.
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Erreur interceptée par ErrorBoundary :', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Une erreur est survenue</h2>
                    <p>Essaie de recharger la page. Si le problème persiste, contacte le support.</p>
                    <button onClick={() => window.location.reload()}>Recharger la page</button>
                </div>
            );
        }
        return this.props.children;
    }
}
