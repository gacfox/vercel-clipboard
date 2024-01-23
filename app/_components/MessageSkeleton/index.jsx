"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Skeleton,
} from "@nextui-org/react";

const MessageSkeleton = () => {
  return (
    <>
      <Card className="w-full" isHoverable={true}>
        <CardHeader className="h-[56px]">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-4 w-3/5 rounded-lg bg-default-200 py-2"></div>
          </Skeleton>
        </CardHeader>
        <Divider />
        <CardBody className="h-[96px]">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-4 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg mt-2">
            <div className="h-4 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg mt-2">
            <div className="h-4 w-2/5 rounded-lg bg-default-200"></div>
          </Skeleton>
        </CardBody>
      </Card>
    </>
  );
};

export default MessageSkeleton;
