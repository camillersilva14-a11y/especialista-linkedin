export const WEBHOOK_URL = "https://api.base44.com/api/apps/prod/functions/receiveEvent?secret=saude-em-contexto-2026";

const sendEvent = async (event_type, event_name, additionalData = {}) => {
    try {
        const payload = {
            app_name: "Especialista LinkedIn",
            event_type,
            event_name,
            source: "LinkedIn",
            ...additionalData
        };
        
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.error("Tracker error:", e);
    }
};

export const trackPageview = (pageName) => {
    sendEvent("access", "page_view", { page_name: pageName });
};

export const trackSession = () => {
    sendEvent("access", "session_start", { session_id: Date.now().toString() });
};

export const trackCTA = (ctaName, section) => {
    sendEvent("click", ctaName, { section });
};

export const trackLead = (name, email) => {
    sendEvent("lead", "lead_captured", { user_name: name, user_email: email });
};