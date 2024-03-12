import { useEffect, useRef } from "react";

declare global {
    interface Window {
      fbAsyncInit: () => void;
      FB: {
        init: (params: { xfbml: boolean, version: string }) => void;
      };
    }
  }
  

export const MessengerFbChat = () => {
  const messengerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messengerRef.current && window) {
      messengerRef.current.setAttribute("attribution_version", "biz_inbox");

      messengerRef.current.setAttribute("attribution", "install_email");

      messengerRef.current.setAttribute("page_id", "143965028792776");
      
      window.fbAsyncInit = function () {
        window?.FB?.init({
            xfbml            : true,
            version          : 'v18.0'
        });
      };

      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];

        if (d.getElementById(id)) return;

        js = d.createElement(s);

        js.id = id;

        (js as any).src =
          "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";

        (fjs as any).parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, []);

  return (
    <>
      <div id="fb-root" />
      <div className="fb-customerchat" ref={messengerRef} />
    </>
  );
};
