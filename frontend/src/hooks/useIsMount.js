import { useRef, useEffect } from "react";

// https://stackoverflow.com/a/56267719/16911837
const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
};

export default useIsMount;