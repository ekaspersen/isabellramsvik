// app/components/SpinningLoader.jsx - please use for all loading
import { motion } from "framer-motion";

export const SpinningLoader = () => {
    return (
        <motion.div
            style={{
                width: "50px",
                height: "50px",
                border: "5px solid #584f3e",
                borderTop: "5px solid #c1a061",
                borderRadius: "50%",
                display: "inline-block",
                margin: "auto",
            }}
            animate={{
                rotate: 360,
            }}
            transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
            }}
        />
    );
};
