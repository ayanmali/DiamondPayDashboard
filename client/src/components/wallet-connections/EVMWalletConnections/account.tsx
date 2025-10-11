import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FC } from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export const CryptoAccount: FC = () => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className='flex flex-col items-center justify-center gap-y-4 pt-5'>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      <Label>
      {address && <div>{ensName ? `${ensName} (${address})` : `Connected to ${address}`}</div>}
      </Label>

      <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
  )
}