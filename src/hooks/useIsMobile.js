import React from "react";

export default function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false);

    const handleWindowResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    React.useEffect(() => {
        handleWindowResize();

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    return isMobile;
}
