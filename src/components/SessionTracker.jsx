import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function SessionTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      // 1. Generate session_id and check if already tracked
      let sessionId = sessionStorage.getItem('base44_session_id');
      const alreadyTracked = sessionStorage.getItem('base44_session_tracked');

      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        sessionStorage.setItem('base44_session_id', sessionId);
      }

      if (alreadyTracked === 'true') {
        return; // Execute only once per session
      }

      // 2. Capture and classify referrer
      const referrer = document.referrer || '';
      const lowerReferrer = referrer.toLowerCase();
      let referrerSource = 'Outro';
      
      if (!referrer) {
        referrerSource = 'Direto';
      } else if (lowerReferrer.includes('instagram')) {
        referrerSource = 'Instagram';
      } else if (lowerReferrer.includes('linkedin') || lowerReferrer.includes('lnkd.in')) {
        referrerSource = 'LinkedIn';
      } else if (lowerReferrer.includes('facebook')) {
        referrerSource = 'Facebook';
      } else if (lowerReferrer.includes('google')) {
        referrerSource = 'Google';
      }

      // 3. Detect device_type
      const width = window.innerWidth;
      let deviceType = 'desktop';
      if (width < 768) {
        deviceType = 'mobile';
      } else if (width < 1024) {
        deviceType = 'tablet';
      }

      // 4. Capture current page
      const page = location.pathname;

      // 5. Capture UTM parameters
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source') || '';
      const utmMedium = params.get('utm_medium') || '';
      const utmCampaign = params.get('utm_campaign') || '';
      const utmContent = params.get('utm_content') || '';

      // 6. Save to PageView entity
      try {
        await base44.entities.PageView.create({
          referrer: referrer,
          referrer_source: referrerSource,
          device_type: deviceType,
          page: page,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          session_id: sessionId
        });
        
        sessionStorage.setItem('base44_session_tracked', 'true');
      } catch (error) {
        console.error('Error tracking session visit:', error);
      }
    };

    trackVisit();
  }, [location.pathname]);

  return null;
}