import React, { Suspense } from 'react';
// import { useQuery, gql } from '@apollo/client';
import { Switch, Route } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';

import Navbar from '#components/Navbar';
import Loading from '#components/Loading';

import routeSettings from './route';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Multiplexer(props: Props) {
    const {
        className,
    } = props;

    return (
        <div className={_cs(className, styles.multiplexer)}>
            <Navbar className={styles.navbar} />
            <div className={styles.content}>
                <Suspense
                    fallback={(
                        <Loading message="Loading page..." />
                    )}
                >
                    <Switch>
                        <Route
                            exact
                            path={routeSettings.dashboard.path}
                            render={routeSettings.dashboard.load}
                        />
                        <Route
                            exact
                            path={routeSettings.lost.path}
                            render={routeSettings.lost.load}
                            default
                        />
                    </Switch>
                </Suspense>
                <footer className={styles.footer}>
                    This is a footer
                </footer>
            </div>
        </div>
    );
}
export default Multiplexer;
