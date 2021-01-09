import React from 'react';
import { Link } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';

import route from '../../Root/App/Multiplexer/route';

import styles from './styles.css';

interface Props {
    className?: string;
}

const Navbar = (props: Props) => {
    const { className } = props;

    return (
        <nav className={_cs(className, styles.navbar)}>
            <div className={styles.appBrand}>
                <Link
                    className={styles.link}
                    to={route.dashboard.path}
                >
                    Tuu Type
                </Link>
            </div>
            <div className={styles.main}>
                <div className={styles.navLinks} />
            </div>
            <div className={styles.actions} />
        </nav>
    );
};

export default Navbar;
