import { useAppContext } from "@/context/AppContext"
import { RemoteUser } from "@/types/user"

export default function UsersView() {
    const { users, currentUser } = useAppContext()

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold">Users</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {users.map((user: RemoteUser) => (
                    <div
                        key={user.socketId}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm">{user.username}</span>
                        {user.username === currentUser?.username && (
                            <span className="text-xs text-gray-500">(You)</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
