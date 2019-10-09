import Head from "next/head";
import React from "react";

import GridLayout from "../components/gridLayout";
import Countdown from "../components/Countdown";
import moment from "moment";
import { useRouter } from "next/router";

import Landing from "./landing";

export default () => {
  const router = useRouter();
  const { demo } = router.query;
  return <Landing demo={!!demo}></Landing>;
};
