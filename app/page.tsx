"use client"

import { useState } from "react"
import { pay, getPaymentStatus } from "@base-org/account"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, AlertCircle, ShoppingCart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const RECIPIENT_ADDRESS = "0x749B7b7A6944d72266Be9500FC8C221B6A7554Ce"
const AMOUNT = "1.00"
const TESTNET = false

type PaymentStatus = "idle" | "processing" | "completed" | "failed"

export default function CheckoutPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [transactionId, setTransactionId] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handlePayment = async () => {
    try {
      setPaymentStatus("processing")
      setError("")

      // Initiate payment with Base Pay
      const { id } = await pay({
        amount: AMOUNT,
        to: RECIPIENT_ADDRESS,
        testnet: TESTNET,
      })

      setTransactionId(id)

      // Poll for payment status
      const pollPaymentStatus = async () => {
        try {
          const { status } = await getPaymentStatus({
            id,
            testnet: TESTNET,
          })

          if (status === "completed") {
            setPaymentStatus("completed")
          } else if (status === "failed") {
            setPaymentStatus("failed")
            setError("Payment failed. Please try again.")
          } else {
            // Continue polling
            setTimeout(pollPaymentStatus, 2000)
          }
        } catch (err) {
          console.error("Error checking payment status:", err)
          setPaymentStatus("failed")
          setError("Error checking payment status")
        }
      }

      // Start polling
      setTimeout(pollPaymentStatus, 1000)
    } catch (err: any) {
      console.error("Payment error:", err)
      setPaymentStatus("failed")
      setError(err.message || "Payment failed. Please try again.")
    }
  }

  const BasePayButton = () => (
    <button
      type="button"
      onClick={handlePayment}
      disabled={paymentStatus === "processing"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 16px",
        backgroundColor: "#0000FF",
        border: "none",
        borderRadius: "8px",
        cursor: paymentStatus === "processing" ? "not-allowed" : "pointer",
        fontFamily: "system-ui, -apple-system, sans-serif",
        minWidth: "180px",
        height: "44px",
        opacity: paymentStatus === "processing" ? 0.7 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {paymentStatus === "processing" ? (
        <Loader2 className="h-5 w-5 animate-spin text-white" />
      ) : (
        <img
          src="/placeholder.svg?height=20&width=80"
          alt="Base Pay"
          style={{
            height: "20px",
            width: "auto",
          }}
        />
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Base Builder Quest</CardTitle>
          <CardDescription>Complete your purchase with Base Pay - fast, secure USDC payments on Base</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Product Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">Quest Entry</h3>
                <p className="text-sm text-gray-600">Base Builder Quest 8</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${AMOUNT}</p>
                <p className="text-sm text-gray-600">USDC</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === "completed" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Payment successful! Your transaction has been confirmed on Base.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === "failed" && error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {paymentStatus === "processing" && (
            <Alert className="border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-800">
                Processing your payment... This usually takes less than 2 seconds.
              </AlertDescription>
            </Alert>
          )}

          {/* Transaction ID */}
          {transactionId && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Transaction ID:</p>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{transactionId}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {paymentStatus !== "completed" && <BasePayButton />}

          {paymentStatus === "completed" && (
            <Button className="w-full" onClick={() => window.location.reload()}>
              Make Another Payment
            </Button>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">Powered by Base Pay • Secure USDC payments on Base</p>
            <p className="text-xs text-gray-400 mt-1">
              Recipient: {RECIPIENT_ADDRESS.slice(0, 6)}...{RECIPIENT_ADDRESS.slice(-4)}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
