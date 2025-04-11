import { useAppContext } from "@/context/AppContext"
import { RemoteUser } from "@/types/user"

export default function UsersView() {
    const { users, currentUser } = useAppContext()

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-700/50 p-4">
                <h2 className="text-lg font-semibold text-white">Users</h2>
                <span className="text-sm text-slate-400">
                    {users.length} online
                </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {users.length > 0 ? (
                    users.map((user: RemoteUser) => (
                        <div
                            key={user.username}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800/50 rounded-lg"
                        >
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-sm text-slate-300">{user.username}</span>
                            {user.username === currentUser?.username && (
                                <span className="text-xs text-slate-500">(You)</span>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center">
                        <p className="text-sm text-slate-400">No users online</p>
                    </div>
                )}
            </div>
        </div>
    )
}
