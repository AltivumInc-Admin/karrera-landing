import { getServerSession } from "@/lib/session";
import { getResumeRecord } from "@/lib/dynamo";
import ResumeUpload from "@/components/dashboard/ResumeUpload";
import ResumeDisplay from "@/components/dashboard/ResumeDisplay";
import ParsingStatus from "@/components/dashboard/ParsingStatus";

export default async function ResumePage() {
  const session = await getServerSession();
  if (!session) return null;

  const record = await getResumeRecord(session.email);

  if (!record) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Resume</h1>
        <ResumeUpload />
      </div>
    );
  }

  if (record.status === "pending") {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Resume</h1>
        <ParsingStatus />
      </div>
    );
  }

  if (record.status === "error") {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Resume</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium mb-2">Resume parsing failed</p>
          <p className="text-red-600 text-sm mb-4">{record.parseError ?? "An unexpected error occurred."}</p>
          <ResumeUpload />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Resume</h1>
      <ResumeDisplay data={record.parsedData!} s3Key={record.s3Key} />
    </div>
  );
}
