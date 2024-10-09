import ky from 'ky'
import { useForm } from 'react-hook-form'
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { useMutation } from '@tanstack/react-query'
import WebApp from '@twa-dev/sdk'
import './App.css'

const api = ky.create({ prefixUrl: "https://airdrop-api.devnet.initia.xyz/" })

function App() {
  const { initDataRaw } = retrieveLaunchParams()

  const { register, watch, handleSubmit } = useForm<{ address: string }>({
    defaultValues: { address: "" },
  })
  const { address } = watch()

  const { mutate, isPending } = useMutation({
    mutationFn: async (address: string) => {
      const result = await api.post("claim/social", { 
        body: JSON.stringify({
          type: 3,
          receiver: address,
          code: `tma ${initDataRaw}`
        })
      })
      return JSON.stringify(result)
    },
    onSuccess: (response: string) => {
      WebApp.showAlert(response)
    },
    onError: (error: Error) => {
      WebApp.showAlert(error.message)
    },
  })

  const submit = handleSubmit(async ({ address }) => {
    mutate(address)
  })

  return (
    <form onSubmit={submit}>
      <div className="contents">
        <p className="title">Welcome, Initiate.</p>
        <p className="text">
          <span className="sub-text">
            To confirm your identity and to connect your wallet, please enter your Initia wallet address below.
            Please note that you only get one chance to get your address entered. 
          </span> Make sure it is the correct address, or you will not be eligible for the airdrop.
          <br />
          <br />
          Please make sure to do this on a desktop, as the airdrop website does not support mobile devices.
        </p>
        <input 
          {...register("address", {
            required: true,
          })}
          className="address"
          type="text" 
          placeholder="Enter Initia wallet address"
        />
      </div>
      <button type="submit" className="confirm" disabled={!address || isPending}>
        Confirm
      </button>
    </form>
  )
}

export default App