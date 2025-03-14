import { getPublishedClassDetails } from "@/server/unauthorized-queries";
import { H1, H2, P } from "../../../components/ui/typography";
import AddFromTemplateButton from "./AddFromTemplateButton";
import FrozenBucket from "./FrozenBucket";
import CopyLinkButton from "./CopyLinkButton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReportInaccurateSchema from "./ReportInaccurateSchema";

export default async function Page({
  params,
}: {
  params: Promise<{ classSlug: string }>;
}) {
  const { classSlug } = await params;

  const classData = await getPublishedClassDetails(classSlug);

  return !classData ? (
    <div className="container mx-auto p-8">
      <Card>
        <CardContent className="p-6">
          <H1>Class not found</H1>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="border-2 shadow-md">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <H1 className="text-2xl md:text-3xl">
                {classData.name} ({classData.number})
              </H1>
              <CopyLinkButton id={classData.id} />
            </div>
            <AddFromTemplateButton serverData={classData} />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <H2 className="mb-6 text-xl font-semibold text-primary">Class Structure</H2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {classData.weights.map((bucket, i) => (
              <FrozenBucket
                key={bucket.id}
                bucket={bucket}
                i={i}
                n={classData.weights.length}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 border-t p-4 flex justify-between items-center">
          <P className="text-sm text-muted-foreground">
            Found an issue with this class template?
          </P>
          <ReportInaccurateSchema classId={classData.id} />
        </CardFooter>
      </Card>
    </div>
  );
}
