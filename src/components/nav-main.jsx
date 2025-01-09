"use client";

import { ChevronRight, NotepadText, PersonStanding, Bot } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { useNav } from "./provider/nav-provider";

export function NavMain({ menu = [] }) {
  const navContext = useNav();

  const { selectedItem, setSelectedItem } = navContext;
  const handleNav = (menuTitle, subTitle) => {
    setSelectedItem((prev) => ({
      ...prev,
      mainMenu: menuTitle,
      subMenu: subTitle,
    }));
  };

  const handleSubNav = (menuTitle) => {
    setSelectedItem((prev) => ({
      ...prev,
      subMenu: menuTitle,
    }));
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Saved Note</SidebarGroupLabel>
      <SidebarMenu>
        {menu?.map((item, index) => (
          <Collapsible className="group/collapsible" key={index}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="font-medium">
                  <NotepadText></NotepadText>
                  {item.subMainMenu}
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem key={index + 2}>
                    <SidebarMenuSubButton
                      onClick={() => handleNav(item.subMainMenu, "original")}
                    >
                      <PersonStanding></PersonStanding>
                      {"original"}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem key={index + 4}>
                    <SidebarMenuSubButton
                      onClick={() => handleNav(item.subMainMenu, "ai")}
                    >
                      <Bot></Bot>
                      {"ai"}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
