import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React, { useEffect } from "react";
import axios from "axios";
import {useAPIKey } from "./provider/apikey-provider";
import { Textarea } from "./ui/textarea";
export const APIKey = ({ open, children }) => {
  const [clientKey, setClient] = React.useState("");
  const [prompt, setPrompt] = React.useState("")
  const apikeyContext = useAPIKey();

  const { apiKey, setApiKey } = apikeyContext;

  const patchAPI = async (secret) => {
    const URL = "/api/v1/api";
    const body = {
      key: secret,
      prompt: prompt
    };
    try {
      const res = await axios.post(URL, body);
      if (res) {
        console.log("Updated", res);
        window.location.reload();
      }
    } catch (e) {
      throw e;
    }
    console.log("Client API Key: ", secret);
  };
  const getApiKey = async () => {
    try {
      const res = await axios.get("/api/v1/getapikey");

      if (res) {
        const data = res.data;
        console.log("api key");
        setClient(data[0].key);
        setPrompt(data[0].prompt)
        setApiKey((prev) => ({
          ...prev,
          key: data[0].key,
          prompt: data[0].prompt
        }));
      }
    } catch (e) {
      throw e;
    }
  };
  useEffect(() => {
    getApiKey();
  }, []);
  return (    
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>Enter OpenAI API key</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              API KEY
            </Label>
            <Input
              id="username"
              type="password"
              placeholder="Enter you api key here..."
              className="col-span-3"
              value={clientKey}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prompt" className="text-right">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Enter AI prompt here..."
              className="col-span-3"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" onClick={() => patchAPI(clientKey)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
