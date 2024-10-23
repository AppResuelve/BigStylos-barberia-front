import { Skeleton, Stack } from "@mui/material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";

const TurnsButtonsSkeleton = () => {
  return (
    <>
      <Stack style={{ margin: "15px 0px 0px 0px", padding: "10px" }}>
        <Stack
          direction="row"
          gap={1}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
        </Stack>
      </Stack>
      <hr
        style={{
          border: "1px solid var(--bg-color-medium)",
          width: "95%",
          borderRadius: "10px",
          margin: "0 auto",
        }}
      />
      <Stack spacing={2} style={{ marginTop: "20px", padding: "10px" }}>
        <Stack
          direction="row"
          gap={1}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
        </Stack>
      </Stack>
      <hr
        style={{
          border: "1px solid var(--bg-color-medium)",
          width: "95%",
          borderRadius: "10px",
          margin: "0 auto",
        }}
      />
      <Stack spacing={2} style={{ marginTop: "20px", padding: "10px" }}>
        <Stack
          direction="row"
          gap={1}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={40}
            sx={{ borderRadius: "15px" }}
          />
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

export { TurnsButtonsSkeleton, AdminWorkerSkeleton };
