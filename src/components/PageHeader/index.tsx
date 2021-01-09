import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.css';

interface Props {
    className?: string;
    title: React.ReactNode;
    actions: React.ReactNode;
}

function PageHeader(props: Props) {
    const {
        className,
        title,
        actions,
    } = props;

    return (
        <header className={_cs(styles.header, className)}>
            <div className={styles.headingSection}>
                <h1>
                    { title }
                </h1>
            </div>
            <div className={styles.dummySection} />
            { actions && (
                <div className={styles.actionsSection}>
                    { actions }
                </div>
            )}
        </header>
    );
}

export default PageHeader;
