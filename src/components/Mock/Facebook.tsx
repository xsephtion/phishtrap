"use client";

import React, { useState } from "react";
import "./FacebookLoginMock.css"; // Optional external CSS for better structure
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { Toaster, toast } from "sonner";

const FacebookLoginMock: React.FC = () => {
  const { data } = useSession();
  const [inputData, setData] = useState({ emailInput: "", password: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function submit() {
    fetch("/api/trap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...inputData,
        email: data?.user?.email,
        ignored: false,
      }),
    })
      .then(() => {
        toast.error(
          "You failed the Phishing Test. This is a fake facebook login page"
        );
      })
      .catch(() => {});
  }

  return (
    <div>
      <Toaster richColors />
      <div className="fb-page">
        <div className="fb-container">
          <div className="fb-left">
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg"
              alt="Facebook"
              className="fb-logo"
            />
            <h2 className="fb-subtitle">
              Connect with friends and the world around you on Facebook.
            </h2>
          </div>

          {/* <AlertDialog open={isDialogOpen} setOpen={setIsDialogOpen} /> */}
          <div className="fb-right">
            <div className="fb-card">
              <input
                type="text"
                placeholder="Email or phone number"
                onChange={(e) =>
                  setData({ ...inputData, emailInput: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setData({ ...inputData, password: e.target.value })
                }
              />
              <button className="login-button" onClick={() => submit()}>
                Log In
              </button>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
              <hr />
              <button className="create-account-button">
                Create new account
              </button>
            </div>
            <div className="fb-page-create">
              <a href="#">Create a Page</a> for a celebrity, brand or business.
            </div>
          </div>
        </div>

        <footer className="fb-footer">
          <div className="fb-languages">
            <ul>
              <li>English (US)</li>
              <li>
                <a href="#">Español</a>
              </li>
              <li>
                <a href="#">Français (France)</a>
              </li>
              <li>
                <a href="#">中文(简体)</a>
              </li>
              <li>
                <a href="#">العربية</a>
              </li>
              <li>
                <a href="#">Português (Brasil)</a>
              </li>
              <li>
                <a href="#">Italiano</a>
              </li>
              <li>
                <a href="#">한국어</a>
              </li>
              <li>
                <a href="#">Deutsch</a>
              </li>
              <li>
                <a href="#">हिन्दी</a>
              </li>
              <li>
                <a href="#">日本語</a>
              </li>
            </ul>
          </div>
          <div className="fb-links">
            <ul>
              <li>
                <a href="#">Sign Up</a>
              </li>
              <li>
                <a href="#">Log In</a>
              </li>
              <li>
                <a href="#">Messenger</a>
              </li>
              <li>
                <a href="#">Facebook Lite</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Cookies</a>
              </li>
              <li>
                <a href="#">Ad Choices</a>
              </li>
              <li>
                <a href="#">More...</a>
              </li>
            </ul>
          </div>
          <div className="fb-copyright">
            <span>Meta © 2025</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FacebookLoginMock;

function AlertDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phishing Test</DialogTitle>
        </DialogHeader>

        <p className="mb-4">
          {"You failed the Phishing Test. This is a fake facebook login page"}
        </p>

        <DialogFooter className="flex gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
