"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Home,
  Workflow,
  BarChart3,
  Settings,
  Users,
  Database,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

const navigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Test Quiz", href: "/quiz", icon: BarChart3 },
  { name: "Test Simulation", href: "/simulation", icon: Database },
  { name: "Leaderboard", href: "/leaderboard", icon: Workflow },
  //   { name: "Team", href: "/team", icon: Users },
  //   { name: "Settings", href: "/settings", icon: Settings },
];

const userNavigation = [
  { name: "Test Quiz", href: "/quiz", icon: BarChart3 },
  { name: "Test Simulation", href: "/simulation", icon: Database },
  { name: "Leaderboard", href: "/leaderboard", icon: Workflow },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data } = useSession();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Phishtrap</span>
          </div>
          <div className="text-sm text-gray-500">
            <span>Dashboard</span> <span className="mx-1">/</span>
            <span className="capitalize">
              {pathname === "/" ? "Overview" : pathname.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search workflows, logs..."
              className="pl-10 w-80 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    {`${
                      data?.user?.email
                        ? data?.user?.email[0].toUpperCase()
                        : ""
                    }${
                      data?.user?.email
                        ? data?.user?.email[1].toUpperCase()
                        : ""
                    }`}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{data?.user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 border-r border-gray-200 bg-white h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search anything..."
                className="pl-10 bg-gray-50 border-gray-200 text-sm"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6"
              >
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>

            <nav className="space-y-1">
              {mapperNavigation(data?.user?.email ?? "", pathname)}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

function mapperNavigation(user: string, pathname: string) {
  if (user === "admin@mico.com") {
    return navigation.map((item) => {
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <item.icon className="w-4 h-4 mr-3" />
          {item.name}
        </Link>
      );
    });
  } else {
    return userNavigation.map((item) => {
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <item.icon className="w-4 h-4 mr-3" />
          {item.name}
        </Link>
      );
    });
  }
}
