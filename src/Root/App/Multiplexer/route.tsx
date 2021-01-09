import React, { useEffect, lazy } from 'react';

import styles from './styles.css';

interface TitleProps {
    value: string;
}
function Title({ value }: TitleProps) {
    useEffect(
        () => {
            document.title = value;
        },
        [value],
    );
    return null;
}

interface WrapProps {
    title: string;
    component: React.FC<{ className: string | undefined }>;
}

function WrappedComponent(props: WrapProps) {
    const {
        component: Comp,
        title,
    } = props;

    // FIXME: move styling somewhere else
    return (
        <>
            <Title value={title} />
            <Comp className={styles.view} />
        </>
    );
}

function wrap<T>(props: WrapProps & { path: T }) {
    const { path } = props;
    return {
        path,
        title: props.title,
        load: () => (
            <WrappedComponent
                {...props}
            />
        ),
    };
}
const routeSettings = {
    dashboard: wrap({
        path: '/',
        title: 'Dashboard',
        component: lazy(() => import('../../../views/Dashboard')),
    }),
    lost: wrap({
        path: undefined,
        title: '404',
        component: lazy(() => import('../../../views/FourHundredFour')),
    }),
};

export default routeSettings;
