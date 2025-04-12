import { useAppContext } from "@/context/AppContext"
import { RemoteUser, USER_CONNECTION_STATUS } from "@/types/user"
import Avatar from "react-avatar"

function Users() {
    const { users } = useAppContext()

    return (
        <div className="flex min-h-[200px] flex-grow justify-center overflow-y-auto py-2">
            <div className="flex h-full w-full flex-wrap items-start gap-x-2 gap-y-6">
                {users.map((user) => {
                    return <User key={user.socketId} user={user} />
                })}
            </div>
        </div>
    )
}

const User = ({ user }: { user: RemoteUser }) => {
    const { username, status, isAdmin } = user
    const title = `${username}${isAdmin ? ' (ADMIN)' : ''} - ${status === USER_CONNECTION_STATUS.ONLINE ? "online" : "offline"}`

    return (
        <div
            className="relative flex w-[100px] flex-col items-center gap-2"
            title={title}
        >
            <Avatar 
                name={username} 
                size="50" 
                round={"12px"} 
                title={title}
                className={isAdmin ? "ring-2 ring-indigo-500" : ""}
            />
            <div className="flex flex-col items-center">
                <p className="line-clamp-2 max-w-full text-ellipsis break-words text-center">
                    {username}
                </p>
                {isAdmin && (
                    <span className="mt-1 text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                        ADMIN
                    </span>
                )}
            </div>
            <div
                className={`absolute right-5 top-0 h-3 w-3 rounded-full ${
                    status === USER_CONNECTION_STATUS.ONLINE
                        ? "bg-green-500"
                        : "bg-danger"
                }`}
            ></div>
        </div>
    )
}

export default Users
