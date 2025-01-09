"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import axios from "axios";
import "./App.css";
import { AddDialog } from "./components/add";
import { useContext, useEffect, useState } from "react";
import { NavProvider, useNav } from "./components/provider/nav-provider";
import {
  SearchProvider,
  useSearch,
} from "./components/provider/search-provider";
import { APIkeyLayout } from "./components/api-layout";
import EnhancedQuillCard from "./components/show-quill";


export function SearchComponent({ search_key }) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState("null");
  const searchContext = useSearch();

  const { searchKeyPro, setSearchKeyPro } = searchContext;

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

  useState(() => {
    get("/api/v1/getdata");
  }, []);

  useEffect(() => {
    setSearchText(search_key);
  }, [search_key]);

  return (
    <div className="relative">
      <div className="rounded-lg border border-gray-400 bg-white p-1.5">
        <input
          type="text"
          placeholder="Type to search..."
          className="w-96 px-3 py-2 max-h-1 outline-none"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setOpen(e.target.value?.length > 0);
          }}
          onFocus={() => setOpen(true)}
        />

        {open && (
          <div className="absolute top-full left-0 w-full bg-white rounded-b-lg border-t border-gray-200 shadow-lg max-h-[300px] overflow-y-auto mt-1">
            {data
              ?.filter(
                (item) =>
                  item?.subMainMenu.toLowerCase() ===
                    searchText?.toLowerCase() ||
                  item?.subMainMenu
                    .toLowerCase()
                    .includes(searchText?.toLowerCase())
              )
              .map((item, ke) => (
                <div className="p-2" key={ke}>
                  {item.subMainMenu && (
                    <div className="space-y-1">
                      <button
                        className="text-sm flex items-center gap-2 px-2 w-full hover:bg-gray-100 rounded-md"
                        disabled={true}
                      >
                        {/* You'll need to import these icons or replace them */}

                        <span>{item.subMainMenu}</span>
                      </button>
                      <div className="flex gap-2">
                        <button
                          className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setSearchKeyPro((prev) => ({
                              ...prev,
                              key: item.subMainMenu,
                              second_key: "original",
                            }));
                            setOpen(false);
                            setSearchText("");
                          }}
                        >
                          Original
                        </button>
                        <button
                          className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setSearchKeyPro((prev) => ({
                              ...prev,
                              key: item.subMainMenu,
                              second_key: "ai",
                            }));
                            setOpen(false);
                            setSearchText("");
                          }}
                        >
                          AI
                        </button>
                      </div>

                      <div className="h-px bg-gray-200 my-2" />
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { selectedItem, setSelectedItem } = useNav();
  const [data, setData] = useState();
  const { searchKeyPro, setSearchKeyPro } = useSearch();
  const [isOpen, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

  useEffect(() => {
    get("/api/v1/getdata");
  }, []);

  useEffect(() => {
    console.log("I am here main menu");
    setOpen(false);
  }, [selectedItem.mainMenu]);

  useEffect(() => {
    console.log("I am here111");
    console.log(selectedItem);
    setOpen(true);
  }, [searchKeyPro.key]);

  return (
    <SidebarProvider>
      <AppSidebar isCollapsed={collapsed} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 p-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger
              size="md"
              className="-ml-1 bg-white"
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
          <div className="flex items-center gap-4 mr-4 flex-1 justify-center">
            <SearchComponent />
            <AddDialog />
          </div>
        </header>
        <hr />
        <div>
          {isOpen ? (
            <>
              {data
                ?.filter((item) => item.subMainMenu === searchKeyPro.key)
                .map((item, key) => (
                  <>
                    {searchKeyPro.second_key === "original" ? (
                      <>
                        <EnhancedQuillCard
                          title={item.subMainMenu}
                          content={item.subMenus.original}
                          timestamp={item.createdAt}
                          key={key}
                        ></EnhancedQuillCard>
                      </>
                    ) : (
                      <>
                        <EnhancedQuillCard
                          title={item.subMainMenu}
                          content={item.subMenus.ai}
                          timestamp={item.createdAt}
                          key={key}
                        ></EnhancedQuillCard>
                      </>
                    )}
                  </>
                ))}
            </>
          ) : (
            <>
              {data
                ?.filter((item) => item.subMainMenu === selectedItem.mainMenu)
                .map((item, key) => (
                  <>
                    {selectedItem.subMenu === "original" ? (
                      <>
                        <EnhancedQuillCard
                          title={item.subMainMenu}
                          content={item.subMenus.original}
                          timestamp={item.createdAt}
                          key={key}
                        ></EnhancedQuillCard>
                      </>
                    ) : (
                      <>
                        <EnhancedQuillCard
                          title={item.subMainMenu}
                          content={item.subMenus.ai}
                          timestamp={item.createdAt}
                          key={key}
                        ></EnhancedQuillCard>
                      </>
                    )}
                  </>
                ))}

              {/* {data
                ?.filter((item) => item.subMainMenu === selectedItem.mainMenu)
                .map((item, key) => (
                  <Card className="w-full h-full" key={key}>
                    <CardHeader>
                      <CardTitle>{item.subMainMenu}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedItem.subMenu === "original" ? (
                        <RichAIContent aiContent={item.subMenus.original} />
                      ) : selectedItem.subMenu === "ai" ? (
                        <RichAIContent aiContent={item.subMenus.ai} />
                      ) : null}
                    </CardContent>
                  </Card>
                ))} */}
            </>
          )}
        </div>

        {/*         <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
          {isOpen ? (
            <>
             {data
                ?.filter((item) => item.subMainMenu === searchKeyPro.key)
                .map((item, key) => (
                  <Card className="w-full h-full" key={key}>
                    <CardHeader>
                      <CardTitle>{item.subMainMenu}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {searchKeyPro.second_key === "original" ? (
                        <RichAIContent aiContent={item.subMenus.original} />
                      ) : searchKeyPro.second_key === "ai" ? (
                        <RichAIContent aiContent={item.subMenus.ai} />
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
             
            </>
          ) : (
            <>
               {data
                ?.filter((item) => item.subMainMenu === selectedItem.mainMenu)
                .map((item, key) => (
                  <Card className="w-full h-full" key={key}>
                    <CardHeader>
                      <CardTitle>{item.subMainMenu}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedItem.subMenu === "original" ? (
                        <RichAIContent aiContent={item.subMenus.original} />
                      ) : selectedItem.subMenu === "ai" ? (
                        <RichAIContent aiContent={item.subMenus.ai} />
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
            </>
          )}

        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <NavProvider>
      <SearchProvider>
        <APIkeyLayout>
          <AppContent />
        </APIkeyLayout>
      </SearchProvider>
    </NavProvider>
  );
}
