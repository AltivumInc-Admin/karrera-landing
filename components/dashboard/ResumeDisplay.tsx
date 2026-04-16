"use client";

import { useState } from "react";
import type { ResumeData } from "@/types/resume";
import ResumePreviewModal from "./ResumePreviewModal";
import { FileText, ExternalLink, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResumeDisplay({
  data,
  s3Key,
}: {
  data: ResumeData;
  s3Key: string;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const router = useRouter();

  async function handleReplace() {
    setReplacing(true);
    try {
      await fetch("/api/resume/confirm", {
        method: "DELETE",
      });
      router.refresh();
    } catch {
      setReplacing(false);
    }
  }

  const { basics, experience, education, skills, certifications, projects, military } = data;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header with preview button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Parsed Resume</div>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium"
          >
            <FileText size={14} />
            View Original
          </button>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Basics */}
          {basics && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">{basics.name}</h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                {basics.location && <span>{basics.location}</span>}
                {basics.email && <span>{basics.email}</span>}
                {basics.phone && <span>{basics.phone}</span>}
              </div>
              {(basics.linkedin || basics.github || basics.website) && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {basics.linkedin && (
                    <a href={basics.linkedin.startsWith("http") ? basics.linkedin : `https://${basics.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline flex items-center gap-1">
                      LinkedIn <ExternalLink size={10} />
                    </a>
                  )}
                  {basics.github && (
                    <a href={basics.github.startsWith("http") ? basics.github : `https://${basics.github}`} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline flex items-center gap-1">
                      GitHub <ExternalLink size={10} />
                    </a>
                  )}
                  {basics.website && (
                    <a href={basics.website.startsWith("http") ? basics.website : `https://${basics.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline flex items-center gap-1">
                      Website <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {basics?.summary && (
            <Section title="Summary">
              <p className="text-sm text-gray-700 leading-relaxed">{basics.summary}</p>
            </Section>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <Section title="Experience">
              <div className="space-y-5">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{exp.title}</div>
                        <div className="text-sm text-gray-600">{exp.company}{exp.location ? ` \u00B7 ${exp.location}` : ""}</div>
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                        {exp.startDate} \u2013 {exp.endDate}
                      </div>
                    </div>
                    {exp.bullets?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.bullets.map((b, j) => (
                          <li key={j} className="text-sm text-gray-600 pl-4 relative before:content-['\u2022'] before:absolute before:left-0 before:text-gray-400">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <Section title="Education">
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{edu.institution}</div>
                      <div className="text-sm text-gray-600">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                        {edu.gpa ? ` \u00B7 GPA: ${edu.gpa}` : ""}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {edu.startDate} \u2013 {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Skills */}
          {skills && (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.languages?.length > 0 || skills.tools?.length > 0) && (
            <Section title="Skills">
              <div className="space-y-2">
                {skills.technical?.length > 0 && (
                  <SkillRow label="Technical" items={skills.technical} />
                )}
                {skills.tools?.length > 0 && (
                  <SkillRow label="Tools" items={skills.tools} />
                )}
                {skills.languages?.length > 0 && (
                  <SkillRow label="Languages" items={skills.languages} />
                )}
                {skills.soft?.length > 0 && (
                  <SkillRow label="Soft Skills" items={skills.soft} />
                )}
              </div>
            </Section>
          )}

          {/* Certifications */}
          {certifications?.length > 0 && (
            <Section title="Certifications">
              <div className="space-y-2">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-medium text-sm text-gray-900">{cert.name}</span>
                      <span className="text-sm text-gray-500"> \u00B7 {cert.issuer}</span>
                      {cert.credlyUrl && (
                        <a href={cert.credlyUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-teal-600 hover:underline">
                          Verify
                        </a>
                      )}
                    </div>
                    {cert.date && <span className="text-xs text-gray-400 shrink-0">{cert.date}</span>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <Section title="Projects">
              <div className="space-y-3">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <div className="font-semibold text-sm text-gray-900">
                      {proj.name}
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-teal-600 hover:underline font-normal">
                          Link <ExternalLink size={10} className="inline" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {proj.technologies.map((t, j) => (
                          <span key={j} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Military */}
          {military && military.length > 0 && (
            <Section title="Military Service">
              <div className="space-y-4">
                {military.map((mil, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{mil.role}</div>
                        <div className="text-sm text-gray-600">{mil.branch} \u00B7 {mil.rank}</div>
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                        {mil.startDate} \u2013 {mil.endDate}
                      </div>
                    </div>
                    {mil.highlights?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {mil.highlights.map((h, j) => (
                          <li key={j} className="text-sm text-gray-600 pl-4 relative before:content-['\u2022'] before:absolute before:left-0 before:text-gray-400">{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={handleReplace}
            disabled={replacing}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            <RefreshCw size={12} />
            {replacing ? "Removing..." : "Replace resume"}
          </button>
        </div>
      </div>

      {showPreview && (
        <ResumePreviewModal s3Key={s3Key} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SkillRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs font-medium text-gray-500 w-20 shrink-0 pt-0.5">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s, i) => (
          <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{s}</span>
        ))}
      </div>
    </div>
  );
}
