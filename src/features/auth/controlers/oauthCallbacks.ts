import { NextFunction, Request, Response } from "express";
import { getProfileInfo, getToken, validateToken } from "../../../utils";
import axios from "axios";

export const googleSignInCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.query.code as string;
    // return res.json({ body: req.body, query: req.query, headers: req.headers });
    // const { id_token } = await getToken(code);
    // console.log(id_token);
    // const resp = await validateToken(id_token!);
    // console.log(resp);

    const profile = await getProfileInfo(code);
    console.log(profile);

    const user = {
      googleId: profile?.sub,
      name: profile?.name,
      firstName: profile?.given_name,
      lastName: profile?.family_name,
      email: profile?.email,
      profilePic: profile?.picture,
    };

    res.json({ user });
  } catch (e: any) {
    res.status(401).json({ detail: e.message });
  }
};
