import React, { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TOKEN_LIST, getTokenIcon } from "@/constants/tokens";
import type { TokenInfo } from "@/types/token";

interface TokenSelectorProps {
  selectedToken: TokenInfo | null;
  onSelectToken: (token: TokenInfo) => void;
  prices: Record<string, number>;
  label?: string;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onSelectToken,
  prices,
  label = "Select Token",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = TOKEN_LIST.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter((token) => prices[token.symbol.toLowerCase()]);

  const handleSelectToken = (token: (typeof TOKEN_LIST)[0]) => {
    onSelectToken({
      symbol: token.symbol,
      name: token.name,
      price: prices[token.symbol.toLowerCase()],
      icon: getTokenIcon(token.symbol),
    });
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full justify-between h-12 px-3 bg-white hover:bg-gray-50 border-gray-200"
      >
        <div className="flex items-center gap-2">
          {selectedToken ? (
            <>
              <img
                src={selectedToken.icon}
                alt={selectedToken.symbol}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="font-medium">{selectedToken.symbol}</span>
            </>
          ) : (
            <span className="text-gray-500">{label}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[600px] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Select a token</DialogTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or symbol"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[400px] px-2 pb-2">
            {filteredTokens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tokens found
              </div>
            ) : (
              filteredTokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleSelectToken(token)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getTokenIcon(token.symbol)}
                      alt={token.symbol}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        (
                          e.target as HTMLImageElement
                        ).src = `https://via.placeholder.com/40/cccccc/666666?text=${token.symbol[0]}`;
                      }}
                    />
                    <div className="text-left">
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-gray-500">{token.name}</div>
                    </div>
                  </div>
                  {prices[token.symbol.toLowerCase()] && (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        ${prices[token.symbol.toLowerCase()].toFixed(2)}
                      </div>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
