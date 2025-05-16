import {
  Badge,
  Card,
  Drawer,
  Tabs,
  Text,
  Button,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBan,
  IconUserCheck,
  IconUserOff,
  IconMenu2,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import JobDesc from "../JobsDesc/JobDesc";
import TalentsCards from "../FindTalents/TalentsCards";

const PostedJobDesc = (props: any) => {
  const [tab, setTab] = useState("overview");
  const [arr, setArr] = useState([]);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const handleTabChange = (value: any) => {
    setTab(value);
    setDrawerOpened(false);
    if (value === "applicants") {
      setArr(props.applicants?.filter((x: any) => x.applicationStatus === "APPLIED"));
    } else if (value === "Invited") {
      setArr(props.applicants?.filter((x: any) => x.applicationStatus === "INTERVIEWING"));
    } else if (value === "offered") {
      setArr(props.applicants?.filter((x: any) => x.applicationStatus === "OFFERED"));
    } else if (value === "rejected") {
      setArr(props.applicants?.filter((x: any) => x.applicationStatus === "REJECTED"));
    }
  };

  useEffect(() => {
    console.log("Applicants on props update:", props.applicants);
    handleTabChange("overview");
  }, [props]);

  const tabList = [
    { value: "overview", label: "Overview" },
    { value: "applicants", label: "Applicants" },
    { value: "Invited", label: "Invited" },
    { value: "offered", label: "Offered" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="mt-5 px-4 sm:px-5">
      {/* Header */}
      <div className="text-xl sm:text-2xl font-semibold flex items-center flex-wrap gap-2">
        {props.jobTitle}
        <Badge variant="light" size="sm" color="bright-sun.4">
          {props.jobStatus}
        </Badge>
      </div>
      <div className="font-medium text-mine-shaft-300 mb-4">{props.location}</div>
      {isSmallScreen ? (
        <>
          <Button
            leftSection={<IconMenu2 />}
            fullWidth
            onClick={() => setDrawerOpened(true)}
            variant="outline"
            className="mb-4"
            color="bright-sun.4"
          >
            Open Tab Panel
          </Button>
          <Drawer
            opened={drawerOpened}
            onClose={() => setDrawerOpened(false)}
            title="Job Menu"
            position="right"
            size="200px"
            overlayProps={{ opacity: 0.5, blur: 2 }}
          >
            <div className="flex flex-col gap-2">
              {tabList.map((item) => (
                <Button
                  key={item.value}
                  variant={tab === item.value ? "filled" : "outline"}
                  onClick={() => handleTabChange(item.value)}
                  color="bright-sun.4"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </Drawer>
        </>
      ) : (
        <Tabs value={tab} onChange={handleTabChange}>
          <Tabs.List className="flex flex-wrap gap-2 text-sm sm:text-base font-semibold mb-2">
            {tabList.map((item) => (
              <Tabs.Tab
                key={item.value}
                value={item.value}
                className="flex-1 sm:flex-none px-4 py-2 text-center sm:text-left"
              >
                {item.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      )}

      {/* Panels */}
      <div className="mt-4">
        {tab === "overview" && (
          <JobDesc {...props} edit={true} closed={props.jobStatus === "CLOSED"} />
        )}

        {(tab === "applicants" || tab === "Invited" || tab === "offered" || tab === "rejected") && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {arr?.length ? (
              arr.map((talent: any, index: number) => (
                <TalentsCards
                  key={index}
                  {...talent}
                  invited={tab === "Invited"}
                  offered={tab === "offered"}
                  rejected={tab === "rejected"}
                  posted={tab === "applicants"}
                />
              ))
            ) : (
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="flex items-center justify-center"
              >
                {tab === "applicants" && <IconBan size={40} stroke={1.5} color="darkgreen" />}
                {tab === "Invited" && <IconUserOff size={40} stroke={1.5} color="gray" />}
                {tab === "offered" && <IconUserCheck size={40} stroke={1.5} color="green" />}
                {tab === "rejected" && <IconBan size={40} stroke={1.5} color="red" />}
                <Text className="text-2xl font-semibold mt-2">
                  {`No ${tab.charAt(0).toUpperCase() + tab.slice(1)} Candidates`}
                </Text>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostedJobDesc;
