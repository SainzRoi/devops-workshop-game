const { Stack, RemovalPolicy } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const codeborder = require('aws-cdk-lib/aws-codebuild');
const codepipeline = require('aws-cdk-lib/aws-codepipeline');
const codepipeline_actions = require('aws-cdk-lib/aws-codepipeline-actions');

class DevopsWorkshopGameStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // 1. Target S3 Bucket for Hosting the Game
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, // Allows public read for static hosting
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // Clean up bucket when stack is deleted
    });

    // 2. Define Pipeline Artifacts
    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    // 3. Create CodeBuild Project
    const buildProject = new codeborder.PipelineProject(this, 'BuildProject', {
      environment: {
        buildImage: codeborder.LinuxBuildImage.STANDARD_7_0, // Node.js runtime environment
      },
      // Instead of an external file, we embed the buildspec directly in the infrastructure
      buildSpec: codeborder.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              nodejs: '18'
            },
            commands: [
              'cd frontend',
              'npm install'
            ]
          },
          build: {
            commands: [
              'npm run build'
            ]
          }
        },
        artifacts: {
          'base-directory': 'frontend/dist', // Tells AWS to grab the compiled Vite assets
          files: [
            '**/*'
          ]
        }
      })
    });

    // 4. Assemble the Pipeline
    new codepipeline.Pipeline(this, 'WorkshopPipeline', {
      pipelineName: 'DevOps-Workshop-Game-Pipeline',
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              actionName: 'GitHub_Source',
              owner: 'chalorejo',
              repo: 'devops-workshop-game',
              branch: 'main',
              // You will create a GitHub token and store it in AWS Secrets Manager
              oauthToken: Stack.of(this).secretValueFromJson('workshop/github', 'token'),
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Vite_Build',
              project: buildProject,
              input: sourceOutput,
              outputs: [buildOutput],
            }),
          ],
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.S3DeployAction({
              actionName: 'S3_Deploy',
              bucket: websiteBucket,
              input: buildOutput,
            }),
          ],
        },
      ],
    });
  }
}

module.exports = { DevopsWorkshopGameStack };