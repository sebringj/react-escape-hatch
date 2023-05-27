import React, { FC, useEffect, useMemo, ForwardRefRenderFunction, useRef } from 'react'

export type RefHarnessProps = {
    [key: string]: any;
    reactComponent: FC;
    refObject: { current?: unknown; };
}

export const RefHarness: FC<RefHarnessProps> = (props) => {
    const ref = useRef(null)
    const RC = props.reactComponent as React.ForwardRefExoticComponent<React.RefAttributes<React.FC>>

    useEffect(() => {
        if (ref.current) {
            props.refObject.current = ref.current
        }
    }, [ref.current, props.refObject])

    return (
        <RC {...(props || {})} ref={ref}  />
    )
}
