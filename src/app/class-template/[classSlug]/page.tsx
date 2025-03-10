import { getPublishedClassDetails } from "@/server/unauthorized-queries";
import { H1 } from "../../../components/ui/typography";
import AddFromTemplateButton from "./AddFromTemplateButton";
import FrozenBucket from "./FrozenBucket";
import CopyLinkButton from "./CopyLinkButton";

export default async function Page({
  params,
}: {
  params: Promise<{ classSlug: string }>;
}) {
  const { classSlug } = await params;

  const classData = await getPublishedClassDetails(classSlug);

  return !classData ? (
    <H1>Class not found</H1>
  ) : (
    <div className="m-4">
      <div className="align-center flex flex-row justify-between gap-4">
        <div className="align-center flex flex-row items-center gap-2">
          <H1>
            {classData.name} ({classData.number}) Template
          </H1>
          <CopyLinkButton id={classData.id} />
        </div>
        <AddFromTemplateButton serverData={classData} />
      </div>
      <div className="mt-8">
        {classData.weights.map((bucket, i) => (
          <FrozenBucket
            bucket={bucket}
            i={i}
            n={classData.weights.length}
          ></FrozenBucket>
        ))}
      </div>
    </div>
  );
}
