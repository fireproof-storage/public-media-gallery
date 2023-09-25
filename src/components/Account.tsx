import { useFireproof } from 'use-fireproof'

export function Account({ userEmail }: { userEmail: string }) {
  const { database } = useFireproof('gallery')

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 leading-5 rounded-lg">
      <button
        className="text-sm text-gray-500 hover:text-gray-700"
        title="Open dashboard"
        onClick={() => database.openDashboard()}
      >
        Account: {userEmail}
      </button>
    </div>
  )
}
