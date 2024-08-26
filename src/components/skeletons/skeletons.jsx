import { Skeleton, Stack } from "@mui/material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";

const turnsButtonsSkeleton = () => {
  return (
    <>
      <Stack style={{ marginBottom: "35px" }}>
        <Stack
          direction="row"
          gap={2}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
        </Stack>
      </Stack>
      <hr
        style={{
          border: "1px solid #d8d8d8",
          width: "100%",
          borderRadius: "10px",
        }}
      />
      <Stack spacing={2} style={{ margin: "35px 0px 35px 0px" }}>
        <Stack
          direction="row"
          gap={2}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
          <Skeleton variant="rounded" width={70} height={40} />
        </Stack>
      </Stack>
    </>
  );
};

const AdminWorkerSkeleton = ({ numAcordeon }) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  return (
    <>
      <Stack spacing={1} style={{ display: "flex", alignItems: "center" }}>
        <Skeleton
          variant="text"
          height={70}
          style={{
            marginBottom: !sm ? "35px" : "",
            width: "80vw",
            maxWidth: "410px",
          }}
        />
        {numAcordeon.map((acordeon, index) => {
          return (
            <Skeleton
              key={index}
              variant="rounded"
              height={58}
              style={{ width: "95vw", maxWidth: "900px" }}
            />
          );
        })}
      </Stack>
    </>
  );
};

const SectionSwitchSkeleton = () => {
  return <Skeleton variant="rounded" height={30} width={55} style={{ borderRadius: "50px" }} />;
};

export { turnsButtonsSkeleton, AdminWorkerSkeleton, SectionSwitchSkeleton };
