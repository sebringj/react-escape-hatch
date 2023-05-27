import React, { FC, useEffect, useState, useCallback, ForwardRefRenderFunction } from 'react'
import { CommonStyle } from './styles/CommonStyle'

export type TestProps = {
    name: string;
    user?: { username: string };
    counterChange: (count: number) => void;
    onCounterClick: (count: number) => void;
}

/**
 * example of using a ref
 */
export type TestRef = {
    resetCount: () => void;
}

// caveat for the time being in that styles must be declared with the component
// due to limitations of webcomponent shadow dom
// upside is you can use simple class names without worrying about name collisions
// because style is scoped only to your webcomponent
const TestStyle = () => {
    return (
        <style>{`
            .container {
                display: inline-block;
                border: 1px dashed black;
                contain: content;
                padding: 10px;
                margin-bottom: 10px;
            }
            .title {
                font-size: 40px;
            }
        `}</style>
    )
}

export const Test: FC<TestProps> = ({ name, counterChange, user, onCounterClick }, ref: React.Ref<TestRef>) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        counterChange(count)
    }, [count])

    const onClick = useCallback(() => {
        setCount(currentCount => {
            const newCount = currentCount + 1
            onCounterClick(newCount)
            return newCount
        })
    }, [onCounterClick])

    React.useImperativeHandle(
        ref,
        () => {
            const refObject: TestRef = {
                resetCount: () => {
                    setCount(0)
                },
            }
            return refObject
        }
        , [])

    return (
        <>
            <CommonStyle />
            <TestStyle />

            <div className="container">
                <div className="title">hi there {name}</div>
                {user ? <div>user: {user.username}</div> : undefined}
                <button onClick={onClick}>count++: {count}</button>
            </div>
        </>
    )
}

export const TestRef = React.forwardRef(Test as ForwardRefRenderFunction<unknown, TestProps>)
