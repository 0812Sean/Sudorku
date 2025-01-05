import React, { useEffect } from 'react';

const AdSense = ({ client, slot, style }) => {
    useEffect(() => {
        if (window.adsbygoogle) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block', ...style }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format="auto"
        ></ins>
    );
};

export default AdSense;
