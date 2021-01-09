import React, { useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback } from 'react';
import { TextInput, Button, Switch, Numeral } from '@togglecorp/toggle-ui';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.css';

function getErrorIndex(foo: string, bar: string) {
    const len = Math.min(foo.length, bar.length);
    let i = 0;
    while (i < len) {
        if (foo[i] !== bar[i]) {
            return i;
        }
        i += 1;
    }
    return Math.max(foo.length, bar.length);
}

interface SimpleWordProps {
    wrong?: boolean | undefined;
    text: string;
    className?: string;
}

function SimpleWord(props: SimpleWordProps) {
    const {
        wrong,
        text,
        className,
    } = props;

    let style: string | undefined;
    if (wrong === undefined) {
        style = undefined;
    } else if (wrong) {
        style = styles.wrong;
    } else {
        style = styles.right;
    }

    return (
        <span
            className={_cs(
                className,
                styles.word,
                style,
            )}
        >
            {text}
        </span>
    );
}

interface ComplexWordProps {
    currentUserText: string | undefined;
    text: string;
    className?: string;
}

function ComplexWord(props: ComplexWordProps) {
    const {
        currentUserText = '',
        text,
        className,
    } = props;

    const spanRef = useRef<HTMLSpanElement>(null);

    const wrongIndex = getErrorIndex(text, currentUserText);

    const chars = useMemo(
        () => text.split('').map((str, i) => ({ str, key: i })),
        [text],
    );

    useEffect(
        () => {
            if (spanRef.current) {
                spanRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'start',
                });
            }
        },
        [],
    );

    return (
        <span
            ref={spanRef}
            className={_cs(
                className,
                styles.complexWord,
            )}
        >
            {chars.map((char, index) => {
                let wrong;
                if (index >= currentUserText.length) {
                    wrong = undefined;
                } else if (index >= wrongIndex) {
                    wrong = true;
                } else {
                    wrong = false;
                }
                return (
                    <SimpleWord
                        key={char.key}
                        text={char.str}
                        wrong={wrong}
                    />
                );
            })}
        </span>
    );
}

interface SentenceProps {
    texts: { key: number, str: string }[];
    userTexts: string[];
    currentUserText: string | undefined;
    multiLineMode: boolean;
}

function Sentence(props: SentenceProps) {
    const {
        currentUserText,
        texts,
        userTexts,
        multiLineMode,
    } = props;
    const currentIndex = userTexts.length;
    return (
        <div
            className={_cs(styles.sentence, multiLineMode ? styles.scrolling : styles.static)}
        >
            {texts.map(({ str, key }, index) => {
                const relativePosition = index - currentIndex;

                if (relativePosition < 0) {
                    const userText = userTexts[index];
                    return (
                        <SimpleWord
                            className={styles.sentenceWord}
                            key={key}
                            text={str}
                            wrong={str !== userText}
                        />
                    );
                }
                if (relativePosition > 0) {
                    return (
                        <SimpleWord
                            className={styles.sentenceWord}
                            key={key}
                            text={str}
                        />
                    );
                }
                return (
                    <ComplexWord
                        // NOTE: adding multi-line-mode as part of key so that
                        // it will be re-render the component
                        className={styles.sentenceWord}
                        key={`${multiLineMode}-${key}`}
                        text={str}
                        currentUserText={currentUserText}
                    />
                );
            })}
        </div>
    );
}

const fullText = 'The quick brown fox jumps over the lazy dog. Two driven jocks help fax my big quiz. Pack my box with five dozen liquor jugs.';

function Dashboard() {
    // Source information
    const [texts] = useState(() => (
        fullText.split(/\s+/).map((str, i) => ({ str, key: i }))
    ));

    // User preference
    const [multiLineMode, setScrollingMode] = useState(false);

    // Level information
    const [timeStarted, setTimeStarted] = useState<number | undefined>();
    const [timeCompleted, setTimeCompleted] = useState<number | undefined>();
    const [text, setText] = useState<string | undefined>();
    const [userTexts, setUserTexts] = useState<string[]>([]);

    const currentText = texts[userTexts.length]?.str;
    const errored = text && (text.length > currentText.length || (
        getErrorIndex(text, currentText) !== Math.max(text.length, currentText.length)
    ));

    const handleChange = useCallback(
        (value: string | undefined) => {
            setTimeStarted((item) => (!item ? new Date().getTime() : item));
            if (value && /\S\s$/.test(value) && !errored) {
                setText('');
                setUserTexts((t) => [...t, value.trimRight()]);
            } else {
                setText(value);
            }
        },
        [errored],
    );

    const handleReset = useCallback(
        () => {
            setText('');
            setUserTexts([]);
            setTimeStarted(undefined);
            setTimeCompleted(undefined);
        },
        [],
    );

    const timeTaken = timeStarted && timeCompleted
        ? (timeCompleted - timeStarted) / (1000 * 60)
        : undefined;

    const wpm = timeTaken
        ? (userTexts.length / timeTaken)
        : undefined;

    const complete = texts.length === userTexts.length;

    useLayoutEffect(
        () => {
            if (complete) {
                setTimeCompleted(new Date().getTime());
            }
        },
        [complete],
    );

    return (
        <div className={styles.dashboard}>
            {!complete ? (
                <div className={styles.block}>
                    <Sentence
                        currentUserText={text}
                        texts={texts}
                        userTexts={userTexts}
                        multiLineMode={multiLineMode}
                    />
                    <TextInput
                        className={styles.textInput}
                        name="text"
                        value={text}
                        onChange={handleChange}
                        disabled={complete}
                        error={errored ? 'No' : undefined}
                        hint={!complete && `${userTexts.length + 1}/${texts.length} words`}
                        autoFocus
                        autoComplete={false}
                    />
                    <Switch
                        name="multiLineMode"
                        label="Multi-line mode"
                        value={multiLineMode}
                        onChange={setScrollingMode}
                    />
                </div>
            ) : (
                <div className={styles.completeBlock}>
                    {wpm !== undefined && (
                        <Numeral
                            className={styles.numeral}
                            value={wpm}
                            suffix=" wpm"
                        />
                    )}
                    {timeTaken !== undefined && (
                        <Numeral
                            className={styles.numeral}
                            value={timeTaken}
                            suffix=" min"
                        />
                    )}
                    <Button
                        name={undefined}
                        onClick={handleReset}
                    >
                        Restart
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
