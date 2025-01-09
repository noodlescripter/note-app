"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import axios from "axios";
import { Layers, Settings } from "lucide-react";
import { APIKey } from "./api-key";

const datas = [
  {
    subMainMenu: "Menu1",
    subMenus: {
      original: "original res",
      ai: "ai res",
    },
  },
  {
    subMainMenu: "Menu1",
    subMenus: {
      original: "original res",
      ai: "ai res",
    },
  },
  {
    subMainMenu: "Menu1",
    subMenus: {
      original: "original res",
      ai: "ai res",
    },
  },
  {
    subMainMenu: "Menu1",
    subMenus: {
      original: "original res",
      ai: "ai res",
    },
  },
  {
    subMainMenu: "Menu1",
    subMenus: {
      original: "original res",
      ai: "ai res",
    },
  },
];

export function AppSidebar({ isCollapsed ,...props }) {
  const [data, setData] = React.useState();
  const [isOpen, setOpen] = React.useState();
  async function get(url) {
    try {
      const res = await axios.get(url);
      const data = res.data;
      console.log(data);
      setData(data);
    } catch (e) {
      throw e;
    }
  }

  React.useState(() => {
    get("/api/v1/getdata");
  }, []);

 return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Layers className="flex-shrink-0" />
          <span className={`transition-all duration-300 text-lg font-extrabold ${isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'}`}>
            Note App <span className="text-xs font-normal">AI Powered</span>
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain menu={data} />
      </SidebarContent>
      
      <div>
        <APIKey open={isOpen}>
          <button 
            className="flex items-center gap-2 m-2"
            onClick={() => setOpen(true)}
          >
            <Settings className="flex-shrink-0" />
            <span className={`transition-all duration-300 ${isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'}`}>
              Settings
            </span>
          </button>
        </APIKey>
      </div>
      
      <SidebarRail />
    </Sidebar>
  );
}
