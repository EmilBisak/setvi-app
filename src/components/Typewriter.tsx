import React, {useEffect, useState} from "react";

import Box from "@mui/material/Box";


type TypewriterProps = {
    text: string;
    speed?: number;  // ms
    punctuationDelayMultiplier?: number;  // delay in ms after punctuation
};

const PUNCTUATION = new Set([".", "!", "?", ",", ";", ":"]);

const Typewriter: React.FC<TypewriterProps> = ({
                                                   text,
                                                   speed = 25,
                                                   punctuationDelayMultiplier = 5,
                                               }) => {
    const [index, setIndex] = useState(0);
    const [done, setDone] = useState(false);
    const [caretVisible, setCaretVisible] = useState(true);

    // reset the animation when the text changes
    useEffect(() => {
        setIndex(0);
        setDone(false);
        setCaretVisible(true);
    }, [text]);

    // typing character by character
    useEffect(() => {
        if (!text) return;
        if (index >= text.length) {
            setDone(true);
            return;
        }

        const currentChar = text[index];
        const isPunctuation = PUNCTUATION.has(currentChar);
        const delay = isPunctuation ? speed * punctuationDelayMultiplier : speed;

        const timer = window.setTimeout(() => {
            setIndex((prev) => prev + 1);
        }, delay);

        return () => window.clearTimeout(timer);
    }, [index, text, speed, punctuationDelayMultiplier]);

    // Blinking caret (while the animation is still running)
    useEffect(() => {
        if (done) {
            setCaretVisible(false);
            return;
        }

        const interval = window.setInterval(() => {
            setCaretVisible((prev) => !prev);
        }, 500);

        return () => window.clearInterval(interval);
    }, [done]);

    const visibleText = text.slice(0, index);

    return (
        <Box
            component="span"
            sx={{
                whiteSpace: "pre-line",
                fontFamily: "inherit",
            }}
        >
            {visibleText}
            {/* CARET only visible while the animation is active */}
            {!done && caretVisible && (
                <Box
                    component="span"
                    sx={{
                        ml: 0.5,
                        fontWeight: 700,
                    }}
                >
                    |
                </Box>
            )}
        </Box>
    );
};

export default Typewriter;
