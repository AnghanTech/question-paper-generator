from flaskapp import models
from test.main.base_classes import BaseUser
from test.main.utils import test_post_request

class TermsOfServiceTestCase(BaseUser):
    def test_terms_of_service(self):
        expected_strings = [
            "you are agreeing to be bound by these terms of",
            "responsible for compliance with any applicable local laws.",
            "The materials contained in this website are protected",
            "by applicable copyright and trademark law.",
            "Permission is hereby granted, free of charge,",
            "a copy of this software and associated",
            "The above copyright notice and this permission",
            "be included in all copies or substantial portion",
            "This license shall automatically terminate if you",
            "any of these restrictions and may be terminated by",
            "all other warranties including, without limitation,",
            "warranties or conditions of merchantability, fitnes",
            "or non-infringement of intellectual property or other",
            "of the materials on its website or otherwise",
            "no event shall SetNow or its suppliers be",
            "including, without limitation, damages for loss of data",
            "However SetNow does not make any commitment to",
            "SetNow has not reviewed all of the sites linked to its",
            "linked site. The inclusion of any link does not imply",
            "SetNow may revise these terms of service for its website",
            "By using this website you are agreeing to be bound by the then",
            "These terms and conditions are governed by and construed in",
            "and you irrevocably submit to the exclusive jurisdiction of",
            "Terms Of Service"
        ]

        response = self.client.get("/terms-of-service")
        for expected_string in expected_strings:
            self.assertIn(expected_string.encode(), response.data)
