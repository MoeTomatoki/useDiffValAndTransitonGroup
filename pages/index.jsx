import { useDeferredValue, useRef, useState } from "react";
import { Transition } from 'react-transition-group';

export default function Home() {

    const generateUsers = [];
    for (let i = 1; i <= 10000; i++) {
        const newName = i % 3 === 0 ? "Вася" : i % 3 === 1 ? "Петя" : "Олежа";
        const newJob = i % 3 === 0 ? "Frontend Devoloper" : i % 3 === 1 ? "Backend Devoloper" : "Full-Stack Devoloper";
        generateUsers.push({
            name: newName,
            job: newJob,
            keyIndex: i,
        })
    }

    const [{ filterText, users }, setFilter] = useState({})
    const [loadingState, setLoadingState] = useState(false)
    const refAscendingFilter = useRef(null)

    function sortArrayByProperty(arr, property, isAscending = true) {
        return arr.sort((a, b) => {
            const aProp = a[property];
            const bProp = b[property];

            if (aProp < bProp) {
                return isAscending ? -1 : 1;
            }
            if (aProp > bProp) {
                return isAscending ? 1 : -1;
            }
            return 0;
        });
    }

    function handleClick(e) {
        setLoadingState(true);
        console.log(e.target)
        switch (e.target.id) {
            case "inputId":
                refAscendingFilter.checked = !refAscendingFilter.checked
                setFilter({ filterText: filterText, users: users.reverse() })
                break;


            default:
                if (filterText === "По номеру") {
                    setFilter({ filterText: "По имени", users: sortArrayByProperty(generateUsers, "name") });
                }
                else if (filterText === "По имени") {
                    setFilter({ filterText: "По работе", users: sortArrayByProperty(generateUsers, "job") });
                }
                else {
                    setFilter({ filterText: "По номеру", users: sortArrayByProperty(generateUsers, "keyIndex") });
                }
                refAscendingFilter.checked = false
                break;
        }
        setTimeout(() => {
            setLoadingState(false);
        }, 1000);
    }
    const deferredUsers = useDeferredValue(users);
    return (
        <div className="flex justify-center">
            <div className="flex flex-col">
                <div className="m-4 flex gap-2 justify-center">
                    <div className="text-sm">Фильтр:</div>
                    <button
                        onClick={handleClick}
                        className="border-[1px] rounded-lg px-3 text-sm min-w-24 hover:bg-blue-50 bg-cyan-50 border-cyan-100"
                    >{filterText || "Загрузить"}</button>

                    <label htmlFor="inputId" className="flex gap-2">
                        <div className="text-sm align-middle">На уменьшение</div>
                        <input id="inputId" className="mt-1" type="checkbox" ref={refAscendingFilter} onClick={(e) => handleClick(e)} checked={refAscendingFilter.checked} />
                    </label>
                </div>
                <Transition
                    in={loadingState}
                    timeout={700}
                    mountOnEnter
                    unmountOnExit
                >
                    {state => (<Loader className={`${state} loader`} />)}
                </Transition>
                {!loadingState && <div className={`flex gap-2 flex-col ${loadingState && "hidden"} animate-[faded_1.75s_forwards]`}>
                    {deferredUsers?.map((user, index) => (
                        <UserInfo user={user} key={index} />
                    )
                    )}
                </div>}
            </div>
        </div>
    )
}

function Loader({ className }) {
    return <div className={`flex pb-[124px] justify-center items-center h-[100vh] `}>
        <div className={`w-24 h-24 rounded-full border-4 border-dashed ${className}`}>
        </div>
    </div>
}

function UserInfo({ user }) {
    return (
        <>
            <div className="flex flex-col p-2 gap-1 border-[1px] rounded-lg px-3 text-sm hover:bg-slate-100 bg-slate-50 border-slate-200">
                <div>{`Имя: ${user.name}`}</div>
                <div>{`Работа: ${user.job}`}</div>
                <div>{`Id-карта: ${user.keyIndex}`}</div>
            </div>
        </>
    )
}