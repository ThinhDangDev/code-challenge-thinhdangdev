import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TokenSelector } from "./TokenSelector";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import type { TokenInfo } from "@/types/token";
import { ArrowDownUp, Loader2, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTokenIcon, TOKEN_LIST } from "@/constants/tokens";

const swapSchema = z.object({
  fromAmount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Amount must be 0 or greater",
      }
    )
    .refine((val) => Number(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  toAmount: z.string(),
});

type SwapFormData = z.infer<typeof swapSchema>;

export const SwapForm: React.FC = () => {
  const { prices, loading: pricesLoading } = useTokenPrices();
  const [fromToken, setFromToken] = useState<TokenInfo | null>(null);
  const [toToken, setToToken] = useState<TokenInfo | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  const getNextAvailableToken = (selectedToken: TokenInfo) => {
    const currentIndex = TOKEN_LIST.findIndex(
      (token) =>
        token.symbol.toLowerCase() === selectedToken.symbol.toLowerCase()
    );

    if (currentIndex === -1 || TOKEN_LIST.length === 1) {
      return TOKEN_LIST[0];
    }

    const nextIndex = (currentIndex + 1) % TOKEN_LIST.length;
    return {
      ...TOKEN_LIST[nextIndex],
      price: prices[TOKEN_LIST[nextIndex].symbol.toLowerCase()],
      icon: getTokenIcon(TOKEN_LIST[nextIndex].symbol),
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromAmount: "",
      toAmount: "",
    },
  });

  const fromAmount = watch("fromAmount");

  useEffect(() => {
    if (
      fromAmount &&
      fromToken &&
      toToken &&
      fromToken.price &&
      toToken.price
    ) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount) && amount >= 0) {
        const fromValue = amount * fromToken.price;
        const toAmount = fromValue / toToken.price;
        setValue("toAmount", Math.max(0, toAmount).toFixed(6));
      }
    } else {
      setValue("toAmount", "");
    }
  }, [fromAmount, fromToken, toToken, setValue]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    const currentFromAmount = fromAmount;
    setFromToken(toToken);
    setToToken(temp);
    setValue("fromAmount", currentFromAmount);
    clearErrors();
  };

  const handleFromTokenSelect = (token: TokenInfo) => {
    if (toToken && token.symbol === toToken.symbol) {
      const nextToken = getNextAvailableToken(token);
      if (nextToken) {
        setToToken(nextToken);
      }
    }
    setFromToken(token);
  };

  const handleToTokenSelect = (token: TokenInfo) => {
    if (fromToken && token.symbol === fromToken.symbol) {
      const nextToken = getNextAvailableToken(token);
      if (nextToken) {
        setFromToken(nextToken);
      }
    }
    setToToken(token);
  };

  const onSubmit = async (_data: SwapFormData) => {
    if (!fromToken || !toToken) {
      return;
    }

    setIsSwapping(true);
    setSwapSuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSwapping(false);
    setSwapSuccess(true);

    setTimeout(() => {
      setSwapSuccess(false);
      setValue("fromAmount", "");
      setValue("toAmount", "");
    }, 3000);
  };

  const estimatedGas = "0.002 ETH";
  const exchangeRate =
    fromToken && toToken && fromToken.price && toToken.price
      ? `1 ${fromToken.symbol} = ${(fromToken.price / toToken.price).toFixed(
          6
        )} ${toToken.symbol}`
      : null;

  if (pricesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md mx-auto mt-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gradient">Token Swap</h1>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Swap</h2>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-end items-center mb-2">
                  {/* <Label className="text-sm text-gray-600">From</Label> */}
                  {fromToken && (
                    <span className="text-xs text-gray-500">
                      Balance: 1000.00 {fromToken.symbol}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      {...register("fromAmount")}
                      type="number"
                      step="any"
                      min="0"
                      placeholder="0.0"
                      className="text-2xl rounded-none focus:!outline-0 focus:!ring-0  font-semibold border-0 bg-transparent p-0 h-auto appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      disabled={isSwapping}
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e" || e.key === "E") {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.fromAmount && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.fromAmount.message}
                      </p>
                    )}
                  </div>
                  <div className="w-32">
                    <TokenSelector
                      selectedToken={fromToken}
                      onSelectToken={handleFromTokenSelect}
                      prices={prices}
                      label="Select"
                    />
                  </div>
                </div>
                {fromToken && fromAmount && fromToken.price && (
                  <p className="text-xs text-gray-500 mt-2">
                    ≈ ${(parseFloat(fromAmount) * fromToken.price).toFixed(2)}
                  </p>
                )}
              </div>

              <div className="flex justify-center items-center gap-2 -my-2 relative z-10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSwapTokens}
                  className="rounded-full h-10 w-10 p-0 bg-white border-4 border-gray-100 hover:border-gray-200"
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-end items-center mb-2">
                  {/* <Label className="text-sm text-gray-600">To</Label> */}
                  {toToken && (
                    <span className="text-xs text-gray-500">
                      Balance: 500.00 {toToken.symbol}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      {...register("toAmount")}
                      type="number"
                      step="any"
                      placeholder="0.0"
                      className="text-2xl  font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      disabled
                    />
                  </div>
                  <div className="w-32">
                    <TokenSelector
                      selectedToken={toToken}
                      onSelectToken={handleToTokenSelect}
                      prices={prices}
                      label="Select"
                    />
                  </div>
                </div>
                {toToken && watch("toAmount") && toToken.price && (
                  <p className="text-xs text-gray-500 mt-2">
                    ≈ $
                    {(parseFloat(watch("toAmount")) * toToken.price).toFixed(2)}
                  </p>
                )}
              </div>

              {exchangeRate && (
                <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate</span>
                    <span className="font-medium">{exchangeRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Gas</span>
                    <span className="font-medium">{estimatedGas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Slippage Tolerance</span>
                    <span className="font-medium">{slippage}%</span>
                  </div>
                </div>
              )}
              <Accordion type="single" collapsible className="w-auto">
                <AccordionItem value="slippage" className="border-0 w-auto">
                  <AccordionTrigger className="flex hover:no-underline p-0 items-center text-xs gap-1">
                    <div className="flex items-center gap-1">
                      Max slippage
                      <span>{slippage}%</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    <div className="flex gap-1">
                      {["0.1", "0.5", "1.0"].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={slippage === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSlippage(value)}
                          className="flex-1 min-w-0 text-xs rounded-full h-7"
                        >
                          {value}%
                        </Button>
                      ))}
                      <Input
                        type="number"
                        value={slippage}
                        onChange={(e) => setSlippage(e.target.value)}
                        className="flex-1 min-w-0 text-xs rounded-full h-7"
                        placeholder="Custom %"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {swapSuccess && (
                <div className="bg-green-50  border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-medium text-center">
                    Swap completed successfully!
                  </p>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold btn-gradient"
                  disabled={!fromToken || !toToken || !fromAmount || isSwapping}
                >
                  {isSwapping ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Swapping...
                    </>
                  ) : (
                    "Swap Tokens"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
