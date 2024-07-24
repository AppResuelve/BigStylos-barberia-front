import { Skeleton, Stack } from "@mui/material";

const TurnsButtonsSkeleton = () => {
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

export { TurnsButtonsSkeleton };
