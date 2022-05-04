// import { useAsync } from "react-async";

// export default function Test() {
//     // An async function for testing our hook.
//     // Will be successful 50% of the time.
//     const myFunction = () => {
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 const rnd = Math.random() * 10;
//                 rnd <= 5
//                     ? resolve("Submitted successfully 🙌")
//                     : reject("Oh no there was an error 😞");
//             }, 2000);
//         });
//     };
//     const { data, isPending, status, error, run } = useAsync({ promiseFn: myFunction });

//     return (
//         <button onClick={run} disabled={isPending}>Run deferFn</button>
//     )
// }
import React, { useState } from "react"
import { useAsync } from "react-async"

const myFunction = () => {
    console.log(called)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const rnd = Math.random() * 10;
            rnd <= 5
                ? resolve("Submitted successfully 🙌")
                : reject("Oh no there was an error 😞");
        }, 2000);
    });
};

export default function Test() {
    // const subscribe = ([email], props, { signal }) =>
    //     fetch("/newsletter", { method: "POST", body: JSON.stringify({ email }), signal })



    const { status, isPending, error, run } = useAsync({ deferFn: myFunction })
    const [email, setEmail] = useState("dfdf@dfd.com")
    console.log(status)

    const handleSubmit = event => {
        event.preventDefault()
        run()
    }
    return (
        // <form onSubmit={run}>
        // <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
        <button onClick={run} type="submit" disabled={isPending}>
            Subscribe
        </button>
        // {error && <p>{error.message}</p>}
        // </form>
    )
}