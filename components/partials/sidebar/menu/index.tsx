"use client";

import React from 'react'


import { useConfig } from "@/hooks/use-config";
import { MenuClassic } from './menu-classic';

import { useMediaQuery } from '@/hooks/use-media-query';

export function Menu({role}) {

    const [config, setConfig] = useConfig()
    const isDesktop = useMediaQuery('(min-width: 1280px)')




    return (
        <MenuClassic role={role}/>
    );
}
